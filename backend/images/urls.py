from django.urls import path
from .views import ImageUploadView, image_list, image_detail, image_delete

app_name = 'images'

urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='upload'),
    path('', image_list, name='list'),
    path('<int:pk>/', image_detail, name='detail'),
    path('<int:pk>/delete/', image_delete, name='delete'),
]

