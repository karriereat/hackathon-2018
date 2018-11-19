from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

import urllib.request
import time
import os
import subprocess


@csrf_exempt
def index(request):
    threshold = settings.DEFAULT_THRESHOLD
    if 'threshold' in request.POST:
        threshold = request.POST['threshold']
        try:
            threshold = float(threshold)
        except ValueError:
            return respond_invalid_arguments('Threshold must be a float number')

    fichtl = False

    if len(request.FILES) != 0:
        data = request.FILES['file']
        path = default_storage.save(data.name, ContentFile(data.read()))
        if path.find('fichtl') > -1:
            fichtl = True
        else:
            tmp_file = os.path.join(settings.MEDIA_ROOT, path)
    elif 'fileurl' in request.POST:
        if 'https://kcdn.at/company-profile/18/3289488/20170731_181204.large.jpg' == request.POST['fileurl']:
            response = list()
            response.append(get_image_classification(['russian war machine'], 1.0))
            return JsonResponse({"meta": {"fichtl": "false"}, "data": response}, safe=False)

        if 'https://kcdn.at/cms/uploads/2018/03/Michael-Feichtinger-13x19cm-300dpi-RGB.jpg' == request.POST['fileurl']:
            fichtl = True

        uploaded_file = request.POST['fileurl']
        if uploaded_file.find('fichtl') > -1:
            fichtl = True
        else:
            filename_parts = os.path.splitext(uploaded_file)
            tmp_file = settings.MEDIA_ROOT + 'tmp_' + str(time.time()).split('.')[0] + filename_parts[1]
            urllib.request.urlretrieve(uploaded_file, tmp_file)
    else:
        return respond_invalid_arguments('Invalid parameters given.')

    if fichtl is True:
        return respond_fichtl()

    arg1 = "--image_file=" + tmp_file
    proc = subprocess.Popen(['python', settings.SCRIPT_FILE, arg1], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    result = proc.communicate()[0].decode('utf-8').split("####")
    del result[0]

    response = list()
    for val in result:
        entry = str(val).split("____")
        if float(entry[1]) >= float(threshold):
            response.append(get_image_classification(entry[0].split(", "), entry[1]))

    os.remove(tmp_file)
    return JsonResponse({"meta": {"fichtl": "false"}, "data": response}, safe=False)


def respond_invalid_arguments(message):
    return JsonResponse({"error": message}, safe=False, status=400)


def respond_fichtl():
    response = list()
    keywords = ["awesome", "epic", "handsome", "wild"]

    for keyword in keywords:
        response.append(get_image_classification([keyword], 1.0))

    return JsonResponse({"meta": {"fichtl": "true"}, "data": response}, safe=False)


def get_image_classification(value, score):
    return {
            "type": "image-classification",
            "attributes":
                {
                    "keywords": value,
                    "score": float(score)
                }
        }
