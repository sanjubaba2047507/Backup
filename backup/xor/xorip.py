def xor_encode_ip(ip_string, key=42):
    encoded = []
    for c in ip_string:
        encoded.append(ord(c) ^ key)
    return encoded

# Example usage:
ip = "127.0.0.1"  # Change this to your C2 server IP
key = 42
obfuscated = xor_encode_ip(ip, key)

# Format output like Java byte array
byte_array = ', '.join(str(b) for b in obfuscated)
print(f'Obfuscated byte array for "{ip}":')
print(f'new byte[]{{{byte_array}}}')
