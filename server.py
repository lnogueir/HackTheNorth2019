from speech import create_speech_file
from translate import translate_text
from vision import jpg_to_text
import messages
import io
import base64
import flask
from flask import Flask, send_file, request, jsonify


app = Flask(__name__)

@app.route('/')
def get_home_speech():
    file_name = create_speech_file(messages.home)
    response = send_file(
        file_name, mimetype='audio/mpeg',
        as_attachment = True,
        attachment_filename = file_name
    )

    return response

@app.route('/image_speak', methods=['POST'])
def translate_image():
    image_base64_str = request.get_json()['image_base64']
    image_name = 'image.jpg'
    binary_img = base64.b64decode(image_base64_str)
    g = open(image_name, "wb")
    g.write(binary_img)
    g.close()

    # f = open(image_name, 'rb')
    # image_binary = f.read()
    # f.close()
    default_text = jpg_to_text('image.jpg')
    translated_text = translate_text(default_text)
    file_name = 'output.mp3'
    # return send_file(
    #     file_name, mimetype='audio/mpeg',
    #     as_attachment=True,
    #     attachment_filename=file_name
    # )
    return 'help'
    # return send_file(io.BytesIO(image_binary), mimetype='image/jpeg')




if __name__ == '__main__':
    app.run(host='10.31.228.87')

