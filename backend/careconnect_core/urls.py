from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

admin.site.site_header = "CareConnect EHR Administration"
admin.site.site_title = "CareConnect Portal"
admin.site.index_title = "Electronic Health Record Management System"

def home_view(request):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CareConnect EHR - Backend Gateway</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); min-height: 100vh; }
        .portal-card { max-width: 580px; width: 100%; border-radius: 16px; border: 1px solid #bae6fd; }
    </style>
</head>
<body class="d-flex align-items-center justify-content-center p-3">
    <div class="card portal-card shadow-lg p-4 bg-white">
        <div class="text-center mb-4">
            <div class="badge bg-primary px-3 py-2 fs-6 mb-2">CareConnect EHR &bull; P03</div>
            <h2 class="fw-bold text-dark m-0">Backend Gateway Active</h2>
            <p class="text-muted small mt-1">Connecting Patients and Providers &bull; ABES Engineering College (MCA 2nd Year)</p>
        </div>

        <div class="d-grid gap-3 mb-4">
            <a href="http://localhost:5173/" class="btn btn-primary btn-lg fw-bold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-browser-chrome fs-4"></i>
                <span>Open React Web Application (Port 5173)</span>
            </a>
            <a href="/admin/" class="btn btn-dark btn-lg fw-bold py-2 d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-shield-lock-fill text-warning fs-5"></i>
                <span>Open Django Admin Panel (/admin/)</span>
            </a>
            <a href="/api/dashboard/stats/" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-braces fs-5"></i>
                <span>Explore REST API Endpoints (/api/)</span>
            </a>
        </div>

        <div class="p-3 bg-light rounded-3 border">
            <div class="fw-bold small text-dark mb-1"><i class="bi bi-key-fill text-primary me-1"></i> Admin Credentials</div>
            <div class="small text-muted">
                Username: <code>admin</code> &bull; Password: <code>Admin@123</code>
            </div>
        </div>
    </div>
</body>
</html>"""
    return HttpResponse(html)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
