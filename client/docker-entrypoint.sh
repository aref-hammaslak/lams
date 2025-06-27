#!/bin/sh
envsubst \
    '${APP_HOST} ${APP_PORT} ${API_URL}' \
    < "${WORKDIR}"/template.conf \
    > "${PATH_SITE_AVAILABLE}"/lams.app

ln -s "${PATH_SITE_AVAILABLE}"/lams.app "${PATH_SITE_ENABLED}"/lams.app

exec "$@"