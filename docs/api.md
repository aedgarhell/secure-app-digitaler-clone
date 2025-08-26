# Secure App Digitaler Clone API Documentation

## Overview

Dieses Dokument beschreibt die aktuell implementierten Module und Endpunkte der „Secure App Digitaler Clone“‑API. Das Projekt ist eine Notfall‑Freigabe‑ und Nachfolge‑Plattform, die Tenants ermöglicht, wichtige Zugangsdaten und Runbooks sicher zu speichern und im Notfall zugänglich zu machen.

## Authentifizierung

- **Anmeldung**: `POST /auth/login` – Authentifiziert einen Benutzer über die lokale Strategy und gibt bei Erfolg einen JWT‑Access‑Token zurück.
- **TOTP einrichten**: `POST /auth/enable‑totp` – Erstellt ein neues TOTP‑Secret für den angemeldeten Benutzer.
- **TOTP verifizieren**: `POST /auth/verify‑totp` – Verifiziert einen TOTP‑Code und aktiviert TOTP für den Benutzer.

## Benutzerverwaltung

Alle Endpunkte befinden sich unter `/users`.

| Methode & Pfad           | Beschreibung                            |
|-------------------------|-----------------------------------------|
| `POST /users`           | Legt einen neuen Benutzer an.           |
| `GET /users`            | Listet alle Benutzer auf.               |
| `GET /users/:id`        | Gibt einen Benutzer anhand seiner ID zurück. |
| `PATCH /users/:id`      | Aktualisiert einen Benutzer.            |
| `DELETE /users/:id`     | Löscht einen Benutzer.                  |

**Zusätzliche Service‑Funktion:** `findByEmail(email)` – sucht einen Benutzer anhand der eindeutigen E‑Mail‑Adresse.

## Vaults

| Methode & Pfad           | Beschreibung                            |
|-------------------------|-----------------------------------------|
| `POST /vaults`          | Erstellt ein neues Vault.               |
| `GET /vaults`           | Listet alle Vaults auf.                 |
| `GET /vaults/:id`       | Gibt ein Vault anhand seiner ID zurück. |
| `PATCH /vaults/:id`     | Aktualisiert ein Vault.                 |
| `DELETE /vaults/:id`    | Löscht ein Vault.                       |

## Runbooks

Runbooks sind Dokumente (Markdown mit optionalen Anhängen), die typischerweise Schritte für den Betrieb oder die Notfall‑Wiederherstellung enthalten.

| Methode & Pfad                 | Beschreibung                                      |
|-------------------------------|---------------------------------------------------|
| `POST /runbooks/:tenantId`    | Erstellt ein neues Runbook für einen Tenant.      |
| `GET /runbooks/:tenantId`     | Listet alle Runbooks eines Tenants auf.           |
| `GET /runbooks/one/:id`       | Gibt ein Runbook anhand seiner ID zurück.         |
| `PATCH /runbooks/:id`         | Aktualisiert ein Runbook.                        |
| `DELETE /runbooks/:id`        | Löscht ein Runbook.                               |

## Onboarding

Das Onboarding‑Modul automatisiert die Einrichtung eines neuen Tenants.

| Methode & Pfad               | Beschreibung                                        |
|-----------------------------|-----------------------------------------------------|
| `POST /onboarding/start`     | Erstellt einen neuen Tenant samt Eigentümer‑User.  |
| `GET /onboarding/:tenantId`  | Gibt den Fortschritt des Onboarding (Vaults, Secrets, Runbooks) zurück. |

## Secrets

Secrets sind vertrauliche Informationen (z. B. Passwörter oder Schlüssel), die verschlüsselt gespeichert werden. Alle Endpunkte erfordern einen gültigen JWT.

| Methode & Pfad           | Beschreibung                                                     |
|-------------------------|------------------------------------------------------------------|
| `POST /secrets`         | Erstellt ein Secret; der Wert wird vor der Speicherung verschlüsselt. |
| `GET /secrets`          | Listet alle Secrets auf (ohne Entschlüsselung).                    |
| `GET /secrets/:id`      | Gibt ein Secret zurück und entschlüsselt den Wert.                |
| `PATCH /secrets/:id`    | Aktualisiert ein Secret; bei neuem Wert wird dieser neu verschlüsselt. |
| `DELETE /secrets/:id`   | Löscht ein Secret.                                                |

## Releases

Das Release‑Modul ermöglicht es, Notfall‑Freigaben auszulösen, abzuschließen und den Zugriff auf alle Secrets und Runbooks eines Tenants zu verteilen.

| Methode & Pfad                 | Beschreibung                                                                 |
|-------------------------------|------------------------------------------------------------------------------|
| `GET /release/status`         | Gibt den aktuellen Release‑Status des Tenants zurück.                        |
| `POST /release/complete/:id`  | Markiert einen Release mit `:id` als abgeschlossen.                         |
| `POST /release/distribute/:id`| Verteilt Secrets und Runbooks des Tenants für den angegebenen Release und gibt diese zurück. |

## Succession (Nachfolge)

Dieses Modul verwaltet Daten zum Nachfolger eines Tenants und steuert die Einladung und Annahme des Nachfolge‑Prozesses.

| Methode & Pfad                     | Beschreibung                                                                                                     |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------|
| `POST /succession`                | Legt Nachfolge‑Informationen (E‑Mail, Fragebogen, Readiness‑Score) für einen Tenant an oder aktualisiert diese.   |
| `GET /succession`                 | Gibt die gespeicherten Nachfolge‑Informationen eines Tenants zurück.                                             |
| `POST /succession/invite`         | Sendet eine Einladung an die Nachfolger‑E‑Mail und generiert ein einmaliges Token, das im Fragebogen gespeichert wird. |
| `POST /succession/accept/:token`  | Akzeptiert die Einladung anhand des Tokens; der Readiness‑Score wird auf 1 gesetzt und der Nachfolger aktiviert.   |

## Audit‑Logs

Das Audit‑Modul zeichnet Aktionen innerhalb der Anwendung auf und ermöglicht deren Abfrage. Alle Endpunkte sind mit einer Rollenprüfung versehen und stehen nur Benutzern mit der Rolle `ADMIN` zur Verfügung.

| Methode & Pfad                 | Beschreibung                                                                                             |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
| `GET /audit`                  | Listet alle Audit‑Log‑Einträge auf.                                                                      |
| `GET /audit/:id`              | Gibt einen Audit‑Log‑Eintrag anhand seiner ID zurück.                                                     |
| `GET /audit/actor/:actorId`   | Listet alle Log‑Einträge für einen bestimmten Actor (Benutzer‑ID).                                       |
| `GET /audit/action/:action`   | Listet alle Log‑Einträge für eine bestimmte Aktion.                                                      |
| `POST /audit/verify`          | Prüft die Signatur eines Audit‑Eintrags. Erwartet den Hash‑Wert im Request‑Body und gibt `true` oder `false` zurück. |

## Implementierungsdetails

- **Datenbankzugriff**: Die API nutzt Prisma als ORM. Jeder Service erhält eine Instanz des `PrismaService`.
- **Verschlüsselung**: Secrets werden mit AES‑256‑CBC verschlüsselt. Der Master‑Key wird aus der Umgebungsvariable `MASTER_KEY` geladen und darf nicht im Repository gespeichert sein.
- **TOTP**: Das Auth‑Modul verwendet `speakeasy` zur Erstellung und Überprüfung von TOTP‑Codes.

## Noch ausstehende Arbeiten
Die folgende Liste enthält Themen, die für eine produktive Nutzung noch eingeplant sind:

- **Tests & CI/CD**: Es wurden bereits erste Platzhalter‑Tests angelegt. Für eine hohe Codequalität sollten Unit‑ und Integration‑Tests ergänzt und über die bestehende GitHub‑Actions‑Pipeline (`ci.yml`) automatisch ausgeführt werden.
- **Rollen- und Berechtigungssystem**: Aktuell ist das Audit‑Modul auf `ADMIN`‑Benutzer beschränkt. Weitere Ressourcen sollten durch ein fein granulares Rollen‑ und Rechte‑Management abgesichert werden (z. B. `OWNER`, `SUCCESSOR`, `USER`).
- **Passwort‑Management & Refresh‑Tokens**: Funktionen wie Passwort‑Reset, Refresh‑Token‑Mechanismen und Rate‑Limiting erhöhen die Sicherheit des Auth‑Moduls.
- **UI‑Ausbau**: Die vorhandene Next.js‑Oberfläche soll erweitert werden, um Tenants, Benutzer, Releases, Succession‑Einladungen, Secrets und Runbooks komfortabel zu verwalten.
- **Architektur‑Dokumentation**: Ergänzend zur API‑Dokumentation sollten technische Diagramme (z. B. Komponenten‑ und Sequenzdiagramme) erstellt werden.
- **Performance & Monitoring**: Indexe, Caching und Telemetrie (z. B. Prometheus, Grafana) verbessern die Performance und ermöglichen Live‑Monitoring des Systems.