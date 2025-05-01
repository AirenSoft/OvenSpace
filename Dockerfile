FROM python:3.9-slim

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN apt-get update && apt-get install -y gcc

COPY . /app

# Install dependencies:
RUN pip install -r /app/requirements.txt

# Run the application:
CMD ["python", "/app/OvenSpace.py"]