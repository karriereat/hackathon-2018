from flask import Flask, render_template, flash, request
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField

# App config.
DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'


class ReusableForm(Form):
    urlField = TextField('Url:', validators=[validators.required()])

@app.route("/", methods=['GET', 'POST'])
def hello():
    form = ReusableForm(request.form)

    print
    form.errors
    if request.method == 'POST':
        urlField = request.form['urlField']
        print
        urlField

        if form.validate():
            # Save the comment here.
            flash('Your URL is ' + urlField)

        else:
            flash('Your URK is incorrect')

    return render_template('index.html', form=form)


if __name__ == "__main__":
    app.run()