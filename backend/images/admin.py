from django.contrib import admin
from .models import OptimizedImage


@admin.register(OptimizedImage)
class OptimizedImageAdmin(admin.ModelAdmin):
    list_display = ['original_name', 'original_size', 'width', 'height', 'format', 'created_at']
    list_filter = ['format', 'created_at']
    search_fields = ['original_name']
    readonly_fields = ['created_at', 'updated_at', 'original_size']

