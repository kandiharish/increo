import pytest
from decimal import Decimal
from app.services.calculation_engine import CalculationEngine
from app.auth.security import hash_password, verify_password
from app.auth.jwt import create_access_token, decode_access_token

def test_calculation_engine_formulas():
    # Arrange base salary components
    current_fixed = Decimal('100000.0')
    current_variable = Decimal('20000.0')
    current_mediclaim = Decimal('5000.0')
    current_gratuity = Decimal('2500.0')
    current_retention = Decimal('10000.0')

    # Apply 10% Fixed increment, 5% Variable increment, and 20% Retention override
    pct_fixed = Decimal('10.0')
    pct_variable = Decimal('5.0')
    pct_retention = Decimal('20.0')

    # Act
    projection = CalculationEngine.calculate_projection(
        current_fixed=current_fixed,
        current_variable=current_variable,
        current_mediclaim=current_mediclaim,
        current_gratuity=current_gratuity,
        current_retention=current_retention,
        pct_fixed=pct_fixed,
        pct_variable=pct_variable,
        pct_retention=pct_retention
    )

    # Assert
    # 1. Projected Fixed = 100,000 * 1.10 = 110,000
    assert projection["fixed_pay"] == Decimal('110000.0')
    
    # 2. Projected Variable = 20,000 * 1.05 = 21,000
    assert projection["variable_pay"] == Decimal('21000.0')
    
    # 3. Projected Retention = 10,000 * 1.20 = 12,000
    assert projection["retention_bonus"] == Decimal('12000.0')
    
    # 4. Projected Mediclaim should remain unchanged
    assert projection["mediclaim"] == Decimal('5000.0')
    
    # 5. Projected Gratuity = 2.5% of Projected Fixed (110,000) = 2,750
    assert projection["gratuity"] == Decimal('2750.0')
    
    # 6. Projected CTC = 110k + 21k + 12k + 5k + 2.75k = 150,750
    expected_ctc = Decimal('110000.0') + Decimal('21000.0') + Decimal('12000.0') + Decimal('5000.0') + Decimal('2750.0')
    assert projection["projected_ctc"] == expected_ctc

def test_calculation_engine_mediclaim_default():
    # If mediclaim is zero, it defaults to company standard 4330
    projection = CalculationEngine.calculate_projection(
        current_fixed=Decimal('100000.0'),
        current_variable=Decimal('0.0'),
        current_mediclaim=Decimal('0.0'),
        current_gratuity=Decimal('0.0'),
        current_retention=Decimal('0.0'),
        pct_fixed=Decimal('0.0'),
        pct_variable=Decimal('0.0'),
        pct_retention=Decimal('0.0')
    )
    assert projection["mediclaim"] == Decimal('4330.0')

def test_password_security():
    password = "MySecurePassword123!"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_jwt_utilities():
    data = {"sub": "123", "role": "Manager"}
    token = create_access_token(data)
    
    assert token is not None
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "123"
    assert decoded["role"] == "Manager"
