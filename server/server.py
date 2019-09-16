from speech import create_speech_file
from translate import translate_text, language_list
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
    )

    return response

@app.route('/image_write', methods=['POST'])
def translate_image():
    image_base64_str = request.get_json()['image_base64']
    lang = request.get_json()['language']
    print(lang)
    image_name = 'image.jpg'
    binary_img = base64.b64decode(image_base64_str)
    g = open(image_name, "wb")
    g.write(binary_img)
    g.close()

    # f = open(image_name, 'rb')
    # image_binary = f.read()
    # f.close()
    default_text = jpg_to_text('image.jpg')
    translated_text = translate_text(default_text, lang)
    print(translated_text)
    # file_name = create_speech_file(translated_text)
    # response = send_file(
    #     file_name, mimetype='audio/mpeg',
    # )

    return jsonify({'word': translated_text})
    # return send_file(io.BytesIO(image_binary), mimetype='image/jpeg')

@app.route ('/image_speak', methods=['GET'])
def text_to_speech():
    # language = request.args.get('language')
    prediction = request.args.get('prediction')
    lang = request.args.get('language')
    print(lang)
    file_name = create_speech_file(prediction, lang)

    response = send_file(
        file_name, mimetype='audio/mpeg',
    )

    return response

@app.route ('/get_languages', methods=['GET'])
def get_languages():
    lang_list = language_list()
    return jsonify({'languages':lang_list})






if __name__ == '__main__':
    host = '192.168.0.20'
    app.run(host=host)

