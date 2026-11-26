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

Redirect URI для всех приложений — точный URL развернутого Apps Script Web App (оканчивается на /exec). Для Google используйте scope drive.file; для Яндекс Диска — cloud_api:disk.app_folder; для OneDrive — Files.ReadWrite.AppFolder, User.Read и offline_access; Dropbox — App Folder app type и scopes account_info.read, files.content.read, files.content.write.

## Ограничения и безопасность

- Включайте только необходимые папки/права приложения, не полный доступ ко всему диску.
- Секреты OAuth не добавляйте в GitHub, HTML или клиентский JavaScript.
- Токены хранятся в Script Properties на стороне Apps Script, не в таблице учеников и не в браузере. Владельцы/редакторы проекта Apps Script могут просматривать Script Properties; доступ к редакторам проекта должен быть ограничен доверенными администраторами.
- Этот этап реализует OAuth-подключение и управление связями. Следующий этап добавит загрузку вложений и экспорт/резервное копирование авторских материалов в выбранное облако. Существующие файлы автоматически не переносятся.
