def encode_port(port, key=0x1F, multiplier=0x5):
    # Apply XOR first, then reverse the multiplier
    pre_multiplied = port ^ key
    if pre_multiplied % multiplier != 0:
        raise ValueError("Port XOR key result is not divisible by multiplier.")
    encoded = pre_multiplied // multiplier
    return encoded

# Example usage
target_port = 4414
encoded_value = encode_port(target_port)
print(f"Encoded constant: (0x5 * {encoded_value}) ^ 0x1F")
