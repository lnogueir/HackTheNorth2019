# Imports the Google Cloud client library
from google.cloud import translate

def translate_text(input_text, target_lang = 'en'):
    # Instantiates a client
    translate_client = translate.Client()

    # The text to translate
    text = input_text

    #get language code
    results = translate_client.get_languages()

    # Translates some text
    translation = translate_client.translate(
        text,
        target_language=target_lang)

    return translation['translatedText']

def language_list():
    translate_client = translate.Client()
    return translate_client.get_languages()

