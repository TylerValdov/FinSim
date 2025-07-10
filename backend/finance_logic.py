def calculate_investment_projection(initial, monthly, years, annual_rate):
    """Calculates the investment growth over time."""
    monthly_rate = annual_rate / 100 / 12
    months = years * 12
    future_value = float(initial)
    projection_data = [future_value]
    for i in range(1, months + 1):
        future_value = future_value * (1 + monthly_rate) + float(monthly)
        if i % 12 == 0:
            projection_data.append(round(future_value, 2))
    return projection_data