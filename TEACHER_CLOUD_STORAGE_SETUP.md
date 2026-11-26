# Подключение личных облачных хранилищ преподавателей

Поддерживаемые провайдеры: Google Drive, Яндекс Диск, Microsoft OneDrive и Dropbox.

## OAuth-параметры Apps Script

Добавьте в Script Properties пары ключей:

| Провайдер | Client ID | Client Secret |
|---|---|---|
| Google Drive | GOOGLE_OAUTH_CLIENT_ID | GOOGLE_OAUTH_CLIENT_SECRET |
| Яндекс Диск | YANDEX_OAUTH_CLIENT_ID | YANDEX_OAUTH_CLIENT_SECRET |
| OneDrive | ONEDRIVE_OAUTH_CLIENT_ID | ONEDRIVE_OAUTH_CLIENT_SECRET |
| Dropbox | DROPBOX_OAUTH_CLIENT_ID | DROPBOX_OAUTH_CLIENT_SECRET |

Redirect URI для всех приложений — точный URL веб-приложения с параметром `?action=cloudOAuthCallback` (например, `https://script.google.com/macros/s/…/exec?action=cloudOAuthCallback`). Скопируйте фактическое значение из `ScriptApp.getService().getUrl()` и добавьте параметр; регистрируйте именно этот полный адрес у каждого провайдера. Для Google используйте scope drive.file; для Яндекс Диска — cloud_api:disk.app_folder; для OneDrive — Files.ReadWrite.AppFolder, User.Read и offline_access; Dropbox — App Folder app type и scopes account_info.read, files.content.read, files.content.write.

## Ограничения и безопасность

- Включайте только необходимые папки/права приложения, не полный доступ ко всему диску.
- Секреты OAuth не добавляйте в GitHub, HTML или клиентский JavaScript.
- Токены хранятся в Script Properties на стороне Apps Script, не в таблице учеников и не в браузере. Владельцы/редакторы проекта Apps Script могут просматривать Script Properties; доступ к редакторам проекта должен быть ограничен доверенными администраторами.
- В редакторе курса можно выбрать подключённый диск для новых файлов темы и вложений к лекциям. Файлы сохраняются в закрытой области приложения и выдаются студентам через сервер портала только после проверки доступа к дисциплине и теме.
- Токены обновляются сервером автоматически по refresh token. При отзыве доступа у провайдера потребуется переподключить диск.
- Нельзя отключить диск, пока в нём остаются прикреплённые учебные файлы: сначала удалите их из материалов или перенесите в другое хранилище.
- Тексты лекций, тесты, карточки и другие авторские материалы пока продолжают храниться в таблицах портала. Экспорт и резервное копирование этих материалов в выбранное облако — отдельный следующий этап. Существующие файлы автоматически не переносятся.
