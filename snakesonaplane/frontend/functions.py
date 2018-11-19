import os, stat, mimetypes, httplib

def post_multipart(host, selector, fields, files):
    """
Post fields and files to an http host as multipart/form-data.
@param host: the hostname of the server to connect to.  For example: www.myserver.com
@param selector: where to go on the host.  For example: cgi-bin/myscript.pl or blog/upload, etc..
@param fields: a sequence of (name, value) elements for regular form fields.  For example:
    [("vals", "16,18,19"), ("foo", "bar")]
@param files: a sequence of (name, file) elements for data to be uploaded as files.  For example:
    [ ("mugshot", open("/images/me.jpg", "rb")) ]
@return: the server's response page.
    """

    content_type, body = _encode_multipart_formdata(fields, files)
    h = httplib.HTTPConnection(host)
    headers = {
        'User-Agent': 'python_multipart_caller',
        'Content-Type': content_type
    }
    h.request('POST', selector, body, headers)
    res = h.getresponse()
    return res.read()


def _encode_multipart_formdata(fields, files):
    """
@return: (content_type, body) ready for httplib.HTTP instance
    """

    BOUNDARY = '----------ThIs_Is_tHe_bouNdaRY_$'
    CRLF = '\r\n'
    L = []
    for (key, value) in fields:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"' % key)
        L.append('')
        L.append(value)
    for (key, fd) in files:
        file_size = os.fstat(fd.fileno())[stat.ST_SIZE]
        filename = fd.name.split('/')[-1]
        contenttype = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        L.append('--%s' % BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, filename))
        L.append('Content-Type: %s' % contenttype)
        fd.seek(0)
        L.append('\r\n' + fd.read())
    L.append('--' + BOUNDARY + '--')
    L.append('')
    body = CRLF.join(L)

    content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
    return content_type, body