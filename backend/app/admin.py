from django.contrib import admin

# Register your models here.
import app.models as models
admin.site.register(models.Category)
admin.site.register(models.Transaction)
admin.site.register(models.Budget)
