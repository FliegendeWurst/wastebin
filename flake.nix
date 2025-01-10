{
  description = "Wastebin is a pastebin";

  # Nixpkgs / NixOS version to use.
  # inputs.nixpkgs.url = "nixpkgs/nixos-21.11";

  outputs = { self, nixpkgs }:
    let

      lib = nixpkgs.lib;

      # to work with older version of flakes
      lastModifiedDate = self.lastModifiedDate or self.lastModified or "19700101";

      # Generate a user-friendly version number.
      version = builtins.substring 0 8 lastModifiedDate;

      # System types to support.
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" "x86_64-linux-cross-aarch64-linux" ];

      # Helper function to generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = lib.genAttrs supportedSystems;

      # Nixpkgs instantiated for supported system types.
      nixpkgsFor = forAllSystems (system: let parts = lib.splitString "-cross-" system; in (
        if (lib.length parts) == 1 then import nixpkgs { inherit system; } else import nixpkgs {
          localSystem = lib.elemAt parts 0;
          hostSystem = lib.elemAt parts 0;
          crossSystem = lib.elemAt parts 1;
        }
      ));

    in
    {

      # Provide some binary packages for selected system types.
      packages = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          wastebin = pkgs.rustPlatform.buildRustPackage rec {
            pname = "wastebin";
            version = "2.5.0-unstable";

            src = ./.;

            cargoLock.lockFile = ./Cargo.lock;

            nativeBuildInputs = with nixpkgsFor.${lib.elemAt (lib.splitString "-cross-" system) 0}; [ pkg-config ];

            buildInputs = with pkgs; [ sqlite zstd ];

            env.LIBSQLITE3_SYS_USE_PKG_CONFIG = "1";
            env.ZSTD_SYS_USE_PKG_CONFIG = "1";

            meta = with lib; {
              description = "Wastebin is a pastebin";
              homepage = "https://github.com/FliegendeWurst/wastebin";
              changelog = "https://github.com/FliegendeWurst/wastebin/tree/wip";
              license = licenses.mit;
              maintainers = with maintainers; [ fliegendewurst ];
              mainProgram = "wastebin";
            };
          };
        });

      defaultPackage = forAllSystems (system: self.packages.${system}.wastebin);
    };
}
