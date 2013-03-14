(function () {
    "using strict";

    var YANDEX_READER_URL = 'http://mail.yandex.ru/my/#lenta/group/all',
        YANDEX_STAT_UNREAD_URL = 'https://api-lenta.yandex.ru/stat/unread',
        YANDEX_AUTH_TOKEN = '487a2d3e0735404fa0c8cd7dd6ccd0c6',

        Settings = {
            refresh_timeout: 10000 // 60 sec
        },

        YandexReaderChecker = function () {
            var self = this;
            self.refresh();
            kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function () {
                kango.browser.tabs.create({url: YANDEX_READER_URL});
                self.refresh();
            });
            window.setInterval(function () {self.refresh()}, self._refreshTimeout);
        },

        extension;

    YandexReaderChecker.prototype = {

        _refreshTimeout: Settings.refresh_timeout,
        _feedUrl:        YANDEX_STAT_UNREAD_URL,

        _setOffline: function () {
            kango.ui.browserButton.setIcon('icons/button_gray.png'); // grey icon
            kango.ui.browserButton.setBadgeValue(0);
        },

        _setUnreadCount: function (count) {
            var text = count > 999 ? 999 + '+' : count;

            kango.ui.browserButton.setTooltipText(text);
            kango.ui.browserButton.setIcon('icons/button.png');
            kango.ui.browserButton.setBadgeValue(text);
        },

        refresh: function () {
            var details = {
                    url:         this._feedUrl,
                    async:       true,
                    method:      'GET',
                    contentType: 'application/x-yandex-lenta+xml',
                    headers:     {
                        authorization: 'OAuth ' + YANDEX_AUTH_TOKEN
                    }
                },
                self = this;

            kango.xhr.send(details, function (data, xhr) {
                if (data.status == 200 && data.response != null) {
                    var count = 0,
                        matches = data.response.match(/(\d)<\/unread>/);  // Old IE versions doensn't support getElementsByTagNameNS, so we using RegExp

                    if (matches != null && matches.length > 0) {
                        count = matches[1];
                    }
                    self._setUnreadCount(parseInt(count, 10));
                } else { // something went wrong
                    self._setOffline();
                }
            });
        }
    };

    extension = new YandexReaderChecker();
}());
