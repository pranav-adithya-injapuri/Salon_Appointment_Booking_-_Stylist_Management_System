import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

def make_supabase_request(method, endpoint, payload=None, params=None, auth_token=None):
    url = f"{supabase_url}/rest/v1/{endpoint}"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {auth_token if auth_token else supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    if method.upper() == 'GET':
        response = requests.get(url, headers=headers, params=params)
    elif method.upper() == 'POST':
        response = requests.post(url, headers=headers, json=payload, params=params)
    elif method.upper() == 'PUT':
        # Supabase uses PATCH or POST with Prefer for updates usually, but PATCH is standard for PostgREST updates
        response = requests.patch(url, headers=headers, json=payload, params=params)
    else:
        raise ValueError("Unsupported HTTP method")
        
    response.raise_for_status()
    return response.json()

@app.before_request
def before_request():
    # Parse auth token manually if provided
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        request.supabase_token = auth_header.split(" ")[1]
    else:
        request.supabase_token = None

@app.route('/api/salon_appointment_booking_stylist_m', methods=['GET', 'POST'])
def appointments_handler():
    token = getattr(request, 'supabase_token', None)
    
    if request.method == 'POST':
        try:
            data = request.json
            customer_payload = data.get('customerPayload')
            appointment_payload = data.get('appointmentPayload')
            
            customer_id = None

            if customer_payload:
                email = customer_payload.get('email')
                # Check if customer exists
                existing_customer = make_supabase_request('GET', 'customers', params={'email': f'eq.{email}', 'select': 'customer_id'}, auth_token=token)
                
                if existing_customer and len(existing_customer) > 0:
                    customer_id = existing_customer[0]['customer_id']
                else:
                    new_customer = make_supabase_request('POST', 'customers', payload=customer_payload, auth_token=token)
                    if new_customer and len(new_customer) > 0:
                        customer_id = new_customer[0]['customer_id']
                    else:
                        raise Exception("Failed to create customer")

            final_appointment_payload = appointment_payload.copy() if appointment_payload else {}
            if customer_id:
                final_appointment_payload['customer_id'] = customer_id

            make_supabase_request('POST', 'appointments', payload=final_appointment_payload, auth_token=token)

            return jsonify({"success": True}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        try:
            response_data = make_supabase_request('GET', 'appointments', params={'select': '*'}, auth_token=token)
            return jsonify(response_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

@app.route('/api/salon_appointment_booking_stylist_m/<id>', methods=['GET', 'PUT'])
def appointment_detail_handler(id):
    token = getattr(request, 'supabase_token', None)
    
    if request.method == 'PUT':
        try:
            payload = request.json
            make_supabase_request('PUT', 'appointments', payload=payload, params={'appointment_id': f'eq.{id}'}, auth_token=token)
            return jsonify({"success": True}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        try:
            response_data = make_supabase_request('GET', 'appointments', params={'appointment_id': f'eq.{id}', 'select': '*'}, auth_token=token)
            if not response_data:
                return jsonify({"error": "Not found"}), 404
            return jsonify(response_data[0]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)
