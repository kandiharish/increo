from decimal import Decimal
from typing import Dict, Any

class CalculationEngine:
    @staticmethod
    def calculate_projection(
        current_fixed: Decimal,
        current_variable: Decimal,
        current_mediclaim: Decimal,
        current_gratuity: Decimal,
        current_retention: Decimal,
        pct_fixed: Decimal,
        pct_variable: Decimal,
        pct_retention: Decimal
    ) -> Dict[str, Decimal]:
        """
        Applies mathematical formulas to calculate projected salary components.
        Conforms strictly to spreadsheet calculations and rounding rules.
        """
        # Convert inputs to decimals to avoid floating point errors
        pct_fixed_multiplier = Decimal('1.0') + (Decimal(str(pct_fixed)) / Decimal('100.0'))
        pct_var_multiplier = Decimal('1.0') + (Decimal(str(pct_variable)) / Decimal('100.0'))
        pct_ret_multiplier = Decimal('1.0') + (Decimal(str(pct_retention)) / Decimal('100.0'))

        # 1. Project Fixed Pay
        proj_fixed = Decimal(round(current_fixed * pct_fixed_multiplier))
        
        # 2. Project Variable Pay
        proj_variable = Decimal(round(current_variable * pct_var_multiplier))
        
        # 3. Project Retention Bonus
        proj_retention = Decimal(round(current_retention * pct_ret_multiplier))
        
        # 4. Mediclaim transition logic:
        # If current mediclaim is 0, default to company standard (4330), otherwise remain constant
        proj_mediclaim = Decimal('4330.0') if current_mediclaim == Decimal('0.0') else current_mediclaim
        
        # 5. Gratuity calculation logic:
        # Calculated dynamically as exactly 2.50% of the projected Fixed Pay (matching Excel)
        proj_gratuity = Decimal(round(proj_fixed * Decimal('0.025')))

        # 6. Total CTC projection sum
        proj_ctc = proj_fixed + proj_variable + proj_retention + proj_mediclaim + proj_gratuity

        return {
            "fixed_pay": proj_fixed,
            "variable_pay": proj_variable,
            "mediclaim": proj_mediclaim,
            "gratuity": proj_gratuity,
            "retention_bonus": proj_retention,
            "projected_ctc": proj_ctc
        }
