from speech import create_speech_file
from translate import translate_text, language_list
from vision import jpg_to_text
from messages import messages
import io
import base64
import os
from flask import Flask, send_file, request, jsonify
from env import USER_IP

app = Flask(__name__)


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'senses_api_key.json'

@app.route('/')
def get_speech():
    message_type = request.args.get('message')
    print(message_type)
    print(message_type)
    file_name = create_speech_file(messages[message_type])
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
    default_text = jpg_to_text('image.jpg')
    os.remove('image.jpg')
    translated_text = translate_text(default_text, lang)
    print(translated_text)
    

    return jsonify({'word': translated_text})

@app.route ('/image_speak', methods=['GET'])
def text_to_speech():
    prediction = request.args.get('prediction')
    lang = request.args.get('language')
    print(lang)
    file_name = create_speech_file(prediction, lang)

    response = send_file(
        file_name, mimetype='audio/mpeg',
    )
    os.remove(file_name)
    return response

@app.route ('/get_languages', methods=['GET'])
def get_languages():
    lang_list = language_list()
    return jsonify({'languages':lang_list})




if __name__ == '__main__':
    app.run(host=USER_IP)
