from flask import Flask, request, jsonify
from flask_cors import CORS
from finance_logic import calculate_investment_projection # Import

app = Flask(__name__)
CORS(app) 

@app.route('/api/investment_projection', methods=['POST'])
def investment_projection_endpoint():
    data = request.get_json()
    # Extract data...
    initial_investment = data['initialInvestment']
    monthly_contribution = data['monthlyContribution']
    investment_period = data['investmentPeriod']
    annual_return = data['annualReturn']
    what_if_monthly = data['whatIfMonthlyContribution']
    what_if_return = data['whatIfAnnualReturn']
    # Perform calculations...
    baseline_projection = calculate_investment_projection(initial_investment, monthly_contribution, investment_period, annual_return)
    what_if_projection = calculate_investment_projection(initial_investment, what_if_monthly, investment_period, what_if_return)
    # Prepare and return response...
    response_data = {"baseline": baseline_projection, "whatIf": what_if_projection}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)