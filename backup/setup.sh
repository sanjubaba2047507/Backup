#!/bin/bash

# 📌 Step 3: Launch Debian and configure inside
cat > $PREFIX/bin/android-build <<EOF
#!/bin/bash
proot-distro login debian --shared-tmp -- bash -c '
  apt update &&
  apt install openjdk-17-jdk wget unzip curl git -y &&
  mkdir -p \$HOME/Android/Sdk &&
  cd \$HOME/Android/Sdk &&
  wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip &&
  unzip commandlinetools-linux-*.zip -d cmdline-tools &&
  mv Android/Sdk/cmdline-tools/cmdline-tools/bin Android/Sdk/cmdline-tools/latest/bin &&
  echo "export ANDROID_SDK_ROOT=\$HOME/Android/Sdk" >> \$HOME/.bashrc &&
  echo "export PATH=\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:\$PATH" >> \$HOME/.bashrc &&
  source \$HOME/.bashrc &&
  cd \$ANDROID_SDK_ROOT/cmdline-tools/latest/bin &&
  yes | ./sdkmanager --licenses &&
  ./sdkmanager \"platform-tools\" \"platforms;android-33\" \"build-tools;33.0.2\"
'
EOF

chmod +x $PREFIX/bin/android-build

echo -e "\n✅ Type this anytime to enter Android build environment:"
echo -e "\n   👉  \033[1mandroid-build\033[0m\n"
