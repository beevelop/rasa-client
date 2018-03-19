FROM rasa/rasa_nlu:latest-spacy

ENV RASA_CORE_VERSION=0.8.3

WORKDIR /root

RUN pip install --user rasa_core && \
    git clone https://github.com/RasaHQ/rasa_core && \
    cd rasa_core && git checkout $RASA_CORE_VERSION && \
    cd examples/remotebot && \
    python -m rasa_nlu.train -c nlu_model_config.json --fixed_model_name current && \
    python -m rasa_core.train -s data/stories.md -d concert_domain_remote.yml -o models/dialogue

WORKDIR /root/rasa_core/examples/remotebot

COPY test.entrypoint.sh ./entrypoint.sh

ENTRYPOINT /root/rasa_core/examples/remotebot/entrypoint.sh