{
  description = "DIY pan-tilt network camera";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    with flake-utils.lib;
    eachSystem allSystems (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ self.overlay ];
      };
    in {
      packages = rec {
        default = kitty-cam;
        inherit (pkgs) kitty-cam;
      };
    }) //
    eachSystem [ "x86_64-linux" "aarch64-linux" ] (system: {
      hydraJobs = {
        inherit (self.packages.${system}) kitty-cam;
      };
    }) //
    {
      overlay = final: prev: {
        kitty-cam = final.python3Packages.callPackage ./. { };
      };
    };
}
