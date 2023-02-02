FROM python:3.9-slim as python

# create a virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# copy requirement.txt file
COPY backend/requirements.txt backend/requirements.txt

# install packages listed in copied requirements.txt file
RUN pip install -r backend/requirements.txt

COPY backend backend

EXPOSE 8000

# start the uvicorn server on $PORT variable
CMD exec uvicorn main:app --host 0.0.0.0 --port 8000