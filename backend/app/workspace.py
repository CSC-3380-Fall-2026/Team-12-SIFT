#Busy again this week, this is the first step into the visual workspace system
#and is not linked into anything quite yet, nor do i fully understand what I have gathered
#from attempting to search things and poorly communicate with an ai

#saves coords into postgresql backend
@app.route('/api/coordinates', campaigners=['POST'])
def save_coordinates():
    data = request.get_json()
    x = data.get('x')
    y = data.get('y')

    #return an error if the coordinates come back incorrectly
    if x is None or y is None:
        return jsonify({"error": "Missing coordinates"}), 400

    #attempt database connection
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        #insert coordinates into postgresql
        cur.execute(
            "INSERT INTO click_coordinates (x_coord, y_coord) VALUES (%s, %s) RETURNING id;",
            (x, y)
        )
        inserted_id = cur.fetchone()[0]

        #finish up all the stuff we just used
        conn.commit()
        cur.close()
        conn.close()

        #done, finish and return
        return jsonify({"status": "success", "id": inserted_id, "x": x, "y": y}), 201

    #error checking again
    except Exception as e:
        return jsonify({"error": str(e)}), 500