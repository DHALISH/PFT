from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, permissions, generics
from .serializers import CategorySerializer, TransactionSerializer,BudgetlistSerializer, BudgetCreateSerializer
from .models import Category, Transaction, Budget
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.db.models import Q

class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 
    authentication_classes = [] 

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])   # ✅ FORCE disable auth
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user_id": user.id,
            "username": user.username
        })

    return Response({"error": "Invalid credentials"}, status=400)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(
            Q(is_default=True) | Q(user=user)
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_default=False)


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)






class BudgetListAPIView(generics.ListAPIView):
    serializer_class = BudgetlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
class BudgetCreateView(CreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_view(request):
    user = request.user

    # ===============================
    # Monthly Income & Expense (Chart)
    # ===============================
    monthly = (
        Transaction.objects
        .filter(user=user)
        .annotate(month=TruncMonth("date"))
        .values("month", "type")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    month_map = {}

    for item in monthly:
        month = item["month"].strftime("%b %Y")
        if month not in month_map:
            month_map[month] = {"income": 0, "expense": 0}

        if item["type"] == "income":
            month_map[month]["income"] = float(item["total"])
        else:
            month_map[month]["expense"] = float(item["total"])

    labels = list(month_map.keys())
    income = [v["income"] for v in month_map.values()]
    expenses = [v["expense"] for v in month_map.values()]

    # ===============================
    # Totals (Dashboard Cards)
    # ===============================
    total_income = (
        Transaction.objects
        .filter(user=user, type="income")
        .aggregate(total=Sum("amount"))["total"] or 0
    )

    total_expense = (
        Transaction.objects
        .filter(user=user, type="expense")
        .aggregate(total=Sum("amount"))["total"] or 0
    )

    balance = total_income - total_expense

    # ===============================
    # Top Expense Categories (Pie)
    # ===============================
    top_expenses_qs = (
        Transaction.objects
        .filter(user=user, type="expense")
        .values("category__name")
        .annotate(amount=Sum("amount"))
        .order_by("-amount")[:5]
    )

    top_expenses = []
    for item in top_expenses_qs:
        percentage = (
            (item["amount"] / total_expense) * 100
            if total_expense else 0
        )
        top_expenses.append({
            "category": item["category__name"],
            "amount": float(item["amount"]),
            "percentage": round(percentage, 1)
        })

    # ===============================
    # Final Response
    # ===============================
    return Response({
        "labels": labels,
        "income": income,
        "expenses": expenses,
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "balance": float(balance),
        "top_expenses": top_expenses,
    })