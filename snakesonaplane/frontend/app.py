from flask import Flask, redirect, render_template, request, session, url_for
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
from functions import post_multipart
import json

app = Flask(__name__)

patch_request_class(app)  # set maximum file size, default is 16MB


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/result', methods=['POST'])
def upload_file():
    api_base_url = 'localhost:8000'
    api_classification_url = '/image_classification/'
    threshold = 0.0

    if request.method == 'POST':
        file_obj = request.files
        response = json.dumps({"error": "no file provided"})

        if 'threshold' in request.form:
            threshold = request.form['threshold']

        if len(request.files) > 0:
            for f in file_obj:
                file = request.files.get(f)

            response = post_multipart(
                api_base_url,
                api_classification_url,
                #[('threshold', str(threshold))],
                [],
                [('file', file)]
            )
        elif 'fileurl' in request.form:
            if len(request.form['fileurl']) > 0:
                response = post_multipart(
                    api_base_url,
                    api_classification_url,
                    #[('fileurl', request.form['fileurl']),('threshold', str(threshold))],
                    [('fileurl', request.form['fileurl'])],
                    []
                )

        return render_template('apiresponse.html', response=json.loads(response))



