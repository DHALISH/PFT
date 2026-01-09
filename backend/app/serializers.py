from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction,Budget
from django.db.models import Sum

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", "")
        )
        return user
    
    



class CategorySerializer(serializers.ModelSerializer):
    is_default = serializers.BooleanField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "description", "user", "is_default"]
        read_only_fields = ["user", "is_default"]
        

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["user"] = request.user
        return super().create(validated_data)

class BudgetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["category", "amount", "start_date", "end_date"]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user
        return super().create(validated_data)


class BudgetlistSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Budget
        fields = [
            "id",
            "category_name",
            "amount",
            "start_date",
            "end_date",
            "spent",
        ]

    def get_spent(self, obj):
        total = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            type="expense",                 # ✅ FIXED HERE
            date__gte=obj.start_date,
            date__lte=obj.end_date,
        ).aggregate(total_spent=Sum("amount"))["total_spent"]

        return total or 0



