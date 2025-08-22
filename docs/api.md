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

## Implementierungsdetails

- **Datenbankzugriff**: Die API nutzt Prisma als ORM. Jeder Service erhält eine Instanz des `PrismaService`.
- **Verschlüsselung**: Secrets werden mit AES‑256‑CBC verschlüsselt. Der Master‑Key wird aus der Umgebungsvariable `MASTER_KEY` geladen und darf nicht im Repository gespeichert sein.
- **TOTP**: Das Auth‑Modul verwendet `speakeasy` zur Erstellung und Überprüfung von TOTP‑Codes.

## Noch ausstehende Arbeiten

- Die Secrets‑API kann erweitert werden, um Secrets tenant‑basiert oder vault‑basiert zu filtern.
- Tests und eine ausführliche technische Architektur (Diagramme) sollten ergänzt werden.
- Eine Frontend‑Anwendung zur Verwaltung der Ressourcen ist noch in Arbeit.
