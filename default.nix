{ buildPythonPackage, flask, flask-cors, lirc }:

buildPythonPackage {
  pname = "kitty-cam";
  version = "0.2";

  src = ./.;

  propagatedBuildInputs = [
    flask
    flask-cors
    lirc
  ];
}
