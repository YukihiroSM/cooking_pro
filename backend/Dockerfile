FROM python:3.9
WORKDIR /usr/local/src/app
COPY . .
RUN pip install -r  requirements.txt
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]