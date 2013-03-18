(function () {
    "use strict";

    var YANDEX_READER_URL            = 'http://mail.yandex.ru/my/#lenta/group/all',
        YANDEX_STAT_UNREAD_URL       = 'https://api-lenta.yandex.ru/stat/unread',
        EXTENSION_ID                 = '695982686e1043d8afe881e729503e33',
        YANDEX_OAUTH_AUTH_SERVICE    = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=' + EXTENSION_ID,
        ICON_16x16                   = 'icons/button.png',
        ICON_16x16_GRAY              = 'icons/button_gray.png',
        TOKEN_NAME                   = 'token',
        TURN_OFFLINE_CONFIRM_MESSAGE = "Выключить расширение Yandex Reader Checker?",

        settings = {
            refresh_timeout:  60000, // 60 sec
            max_count:        999,
            oauth_token:      kango.storage.getItem(TOKEN_NAME)
        },

        mainLoop,

        YandexReaderChecker = function () {
            var self = this;

            self.refresh();

            kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function () {
				var currentTabId,

					//  refresh state after closing the yandex-tab
					tabRemovedHandler = function (e) {
						if (e.tabId === currentTabId) {
							kango.browser.removeEventListener(kango.browser.event.TAB_REMOVED, tabRemovedHandler);

							self.refresh();
						}
					};

                kango.browser.tabs.create({url: YANDEX_READER_URL});
				kango.browser.tabs.getAll(function (tabs) {
					tabs.forEach(function (tab) {
						if (tab.getUrl() === YANDEX_READER_URL) {
							currentTabId = tab._tab.id;
						}
					});
				});

				kango.browser.addEventListener(kango.browser.event.TAB_REMOVED, tabRemovedHandler);

                self.refresh();
            });

            mainLoop = setInterval(function () {self.refresh()}, self._refreshTimeout);
        },

        extension;

    YandexReaderChecker.prototype = {

        _feedUrl:        YANDEX_STAT_UNREAD_URL,
        _refreshTimeout: settings.refresh_timeout,

        _setOffline: function () {
            kango.ui.browserButton.setIcon(ICON_16x16_GRAY); // grey icon
            kango.ui.browserButton.setBadgeValue(0);
        },

        _setUnreadCount: function (count) {
            var text = count > settings.max_count ? settings.max_count + '+' : count;

            kango.ui.browserButton.setTooltipText(text);
            kango.ui.browserButton.setIcon(ICON_16x16);
            kango.ui.browserButton.setBadgeValue(text);
        },

        _getOAuthToken: function () {
			var self        = this,
				yandexTabID = null,
                checkURL    = function (e) {
                    if (e.target._tab.id === yandexTabID && e.url !== YANDEX_OAUTH_AUTH_SERVICE) {
                        response = e.url.match(/.*#access_token=(.*)&token_type/);

                        if (response) {
                            token = response[1];
                        } else {
                            if (confirm(TURN_OFFLINE_CONFIRM_MESSAGE)) {
                                clearInterval(mainLoop);
                                self._setOffline();
                            }
                        }

                        kango.browser.removeEventListener(kango.browser.event.DOCUMENT_COMPLETE, checkURL);
                        e.target.close();

                        if (token) {
                            kango.storage.setItem(TOKEN_NAME, token);
                            settings.oauth_token = token;

                            mainLoop = setInterval(function () {self.refresh()}, self._refreshTimeout);
                        }
                    }
                },
                token,
                response;

            clearInterval(mainLoop);

            kango.browser.tabs.create({url: YANDEX_OAUTH_AUTH_SERVICE});

            kango.browser.tabs.getAll(function (tabs) {
                tabs.forEach(function (tab) {
                    if (tab.getUrl() === YANDEX_OAUTH_AUTH_SERVICE) {
                        yandexTabID = tab._tab.id;
                    }
                });
            });

            kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, checkURL);
        },

        refresh: function () {
            var details,
                self = this;

            if (settings.oauth_token) {

                details = {
                    url:         this._feedUrl,
                    async:       true,
                    method:      'GET',
                    contentType: 'application/x-yandex-lenta+xml',
                    headers: {
                        authorization: 'OAuth ' + settings.oauth_token
                    }
                };

                kango.xhr.send(details, function (data) {
                    if (data.status == 200 && data.response != null) {
                        var count   = 0,
                            matches = data.response.match(/(\d*)<\/unread>/);  // Old IE versions doensn't support getElementsByTagNameNS, so we using RegExp

                        if (matches != null && matches.length > 0) {
                            count = matches[1];
                        }

                        self._setUnreadCount(parseInt(count, 10));
                    } else if (data.status === 401) { // authetication fail
                        self._getOAuthToken();
                    } else { // something went wrong
                        self._setOffline();
                    }
                });
            } else {
                self._getOAuthToken();
            }
        }
    };

    extension = new YandexReaderChecker();
}());
