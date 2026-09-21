import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User
from app.models.report import Report
from app.models.project import Project
from app.schemas.report import ReportGenerateRequest, ReportOut
from app.services.report_service import report_export_service

router = APIRouter()

@router.get("/", response_model=List[ReportOut])
def list_reports(
    project_id: Optional[int] = None,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Report)
    if project_id:
        query = query.filter(Report.project_id == project_id)
    reports = query.order_by(Report.created_at.desc()).limit(limit).all()

    # Inject download URLs
    results = []
    for r in reports:
        pdf_url = f"/api/v1/reports/download/pdf/{r.pdf_filename}" if r.pdf_filename else None
        excel_url = f"/api/v1/reports/download/excel/{r.excel_filename}" if r.excel_filename else None
        results.append(ReportOut(
            id=r.id,
            project_id=r.project_id,
            generated_by_id=r.generated_by_id,
            report_type=r.report_type,
            title=r.title,
            summary=r.summary,
            recommendations=r.recommendations,
            metrics_json=r.metrics_json,
            pdf_url=pdf_url,
            excel_url=excel_url,
            created_at=r.created_at
        ))
    return results

@router.post("/generate", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def generate_report(
    req: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "CLIENT_TEACHER"]))
):
    """
    Generate Weekly or Monthly executive progress report with PDF & Excel files.
    """
    try:
        report = report_export_service.generate_and_save_report(
            project_id=req.project_id,
            report_type=req.report_type,
            user_id=current_user.id,
            custom_notes=req.custom_notes or "",
            db=db
        )
        return ReportOut(
            id=report.id,
            project_id=report.project_id,
            generated_by_id=report.generated_by_id,
            report_type=report.report_type,
            title=report.title,
            summary=report.summary,
            recommendations=report.recommendations,
            metrics_json=report.metrics_json,
            pdf_url=f"/api/v1/reports/download/pdf/{report.pdf_filename}",
            excel_url=f"/api/v1/reports/download/excel/{report.excel_filename}",
            created_at=report.created_at
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.get("/download/pdf/{filename}")
def download_pdf(filename: str):
    file_path = os.path.join(report_export_service.reports_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF report file not found")
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )

@router.get("/download/excel/{filename}")
def download_excel(filename: str):
    file_path = os.path.join(report_export_service.reports_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Excel report file not found")
    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )
