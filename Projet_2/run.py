#!/usr/bin/env python3
"""
Lanceur pour Projet_2 (Liste de courses Java EE)
Utilise Tomcat local s'il est installé, sinon Maven Cargo télécharge Tomcat automatiquement.

Usage :
    python run.py           # lancement normal
    python run.py --tomcat /chemin/vers/tomcat  # forcer un Tomcat spécifique
    python run.py --stop    # arrêter Tomcat (si lancé manuellement)
"""

import os
import sys
import shutil
import subprocess
import platform
import argparse

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_CONTEXT  = "Projet_2"
PORT         = 8080
WAR_FILE     = os.path.join(PROJECT_DIR, "target", f"{APP_CONTEXT}.war")

IS_WINDOWS = platform.system() == "Windows"


def mvn(*args):
    cmd = ["mvn.cmd" if IS_WINDOWS else "mvn"] + list(args)
    return subprocess.run(cmd, cwd=PROJECT_DIR)


def find_tomcat(hint=None):
    candidates = []
    if hint:
        candidates.append(hint)
    candidates += [
        os.environ.get("CATALINA_HOME", ""),
        os.environ.get("TOMCAT_HOME", ""),
    ]
    if IS_WINDOWS:
        for base in ["C:\\Program Files\\Apache Software Foundation",
                     "C:\\tomcat", os.path.expanduser("~\\tomcat")]:
            for name in os.listdir(base) if os.path.isdir(base) else []:
                candidates.append(os.path.join(base, name))
    else:
        candidates += [
            "/usr/local/tomcat", "/opt/tomcat", "/opt/homebrew/opt/tomcat@10",
            "/usr/local/opt/tomcat@10", "/usr/share/tomcat10",
        ]
        result = shutil.which("catalina.sh")
        if result:
            candidates.append(os.path.dirname(os.path.dirname(result)))

    script = "catalina.bat" if IS_WINDOWS else "catalina.sh"
    for path in candidates:
        if path and os.path.isfile(os.path.join(path, "bin", script)):
            return path
    return None


def build():
    print("Construction du WAR...")
    r = mvn("package", "-q")
    if r.returncode != 0:
        print("Erreur de compilation. Arrêt.")
        sys.exit(1)
    print("Build OK →", WAR_FILE)


def launch_with_tomcat(tomcat_home):
    webapps = os.path.join(tomcat_home, "webapps")
    dest    = os.path.join(webapps, f"{APP_CONTEXT}.war")
    print(f"Déploiement vers {dest}")
    shutil.copy(WAR_FILE, dest)

    startup = os.path.join(tomcat_home, "bin",
                           "startup.bat" if IS_WINDOWS else "startup.sh")
    print("Démarrage de Tomcat...")
    subprocess.Popen([startup], shell=IS_WINDOWS)
    print(f"\nApplication disponible sur : http://localhost:{PORT}/{APP_CONTEXT}/")
    print("(Tomcat tourne en arrière-plan — utilisez shutdown.sh pour l'arrêter)")


def launch_with_cargo():
    print("Tomcat local non trouvé → lancement via Maven Cargo (Tomcat téléchargé automatiquement)...")
    print("Première exécution : téléchargement de Tomcat (~10 Mo), patientez.\n")
    mvn("cargo:run")


def stop_tomcat(tomcat_home):
    shutdown = os.path.join(tomcat_home, "bin",
                            "shutdown.bat" if IS_WINDOWS else "shutdown.sh")
    subprocess.run([shutdown], shell=IS_WINDOWS)
    print("Tomcat arrêté.")


def main():
    parser = argparse.ArgumentParser(description="Lanceur Projet_2 Liste de courses Java EE")
    parser.add_argument("--tomcat", help="Chemin vers le répertoire Tomcat")
    parser.add_argument("--stop",   action="store_true", help="Arrêter Tomcat")
    args = parser.parse_args()

    os.chdir(PROJECT_DIR)

    tomcat = find_tomcat(args.tomcat)

    if args.stop:
        if tomcat:
            stop_tomcat(tomcat)
        else:
            print("Tomcat non trouvé pour l'arrêt.")
        return

    build()

    if tomcat:
        print(f"Tomcat trouvé : {tomcat}")
        launch_with_tomcat(tomcat)
    else:
        launch_with_cargo()


if __name__ == "__main__":
    main()
