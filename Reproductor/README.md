# Reproductor de Música Web

Proyecto que implementa un Reproductor de Música utilizando una **Lista Doblemente Enlazada** en Java para manejar la lógica de la lista de reproducción, junto a una interfaz visual web (HTML/JS/CSS).

## Instalación de Requisitos (Windows)

Para ejecutar este proyecto, el sistema debe tener instalados **Java (JDK 17)** y **Apache Maven** configurados en sus Variables de Entorno (`PATH`). A continuación, los métodos recomendados de instalación:

### 1. Instalar Java (JDK 17)
Abra **PowerShell** y ejecute el siguiente comando para instalarlo automáticamente:
```powershell
winget install Microsoft.OpenJDK.17
```

### 2. Instalar Apache Maven
Dado que Maven no tiene un instalador oficial en `winget`, la vía estándar es:
1. Ir a [maven.apache.org/download.cgi](https://maven.apache.org/download.cgi) y descargar el archivo `bin.zip`.
2. Extraer la carpeta en su disco (por ejemplo en `C:\maven`).
3. Buscar "Variables de Entorno" en el menú de Windows, editar la variable `Path` y agregar la ruta hacia la carpeta `bin` (por ejemplo: `C:\maven\apache-maven-3.9.x\bin`).

### 3. Verificar Instalación
Cierre su terminal, ábrala de nuevo y verifique que el sistema reconozca ambas herramientas con los comandos:
```powershell
java -version
mvn -v
```

---

## Instrucciones de Uso

1. **Iniciar el servidor (Backend)**
   Abra una consola en la ruta base del proyecto y ejecute el siguiente comando:
   ```cmd
   .\iniciar-backend.bat
   ```
   *(Alternativamente, puede ingresar a la carpeta con `cd backend` y usar el comando de Maven: `mvn spring-boot:run`).*
   Espere a que la consola le avise que el servidor se ha desplegado en el puerto `8080`.

2. **Abrir la aplicación (Frontend)**
   Entre a la carpeta `frontend` y abra directamente el archivo `index.html` en su navegador web preferido.

3. **Uso del Reproductor**
   Desde la interfaz web de la aplicación, utilice el botón **"Elegir archivo MP3"** para examinar su disco duro y cargar música local. Luego podrá añadir la canción al inicio de la cola, al final de la cola o insertarla en una posición específica por medio de un índice numérico exacto.
