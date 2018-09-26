{ src ? { outPath = ./.; revCount = 1234; shortRev = "abcdef"; },
  pkgs ? import <nixpkgs> { } }: let
  jobs = {

    tarball = pkgs.stdenv.mkDerivation {
      name = "kitty-cam-tarball";
      inherit (jobs.build) version;

      inherit src;

      phases = "unpackPhase buildPhase installPhase";

      nativeBuildInputs = with pkgs.python3Packages; [
        python
        setuptools
      ];

      buildPhase = ''
        python setup.py sdist
      '';

      installPhase = ''
        mkdir -p "$out/nix-support"
        mkdir -p "$out/tarballs"
        mv "dist/"*".tar.gz" "$out/tarballs"
        for i in "$out/tarballs/"*; do
          echo "file source-dist $i" >> $out/nix-support/hydra-build-products
        done
      '';
    };

    build = pkgs.python3Packages.buildPythonPackage rec {
      pname = "kitty-cam";
      version = "0.1";

      src = "${jobs.tarball}/tarballs/kitty-cam-${version}.tar.gz";

      propagatedBuildInputs = with pkgs.python3Packages; [
        flask
        flask-cors
        lirc
      ];
    };
  };
in jobs
