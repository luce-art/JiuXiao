float luminance(vec3 c) {
    return dot(c, vec3(0.2126f, 0.7152f, 0.0722f));
}

vec3 change_luminance(vec3 c_in, float l_out) {
    float l_in = luminance(c_in);
    return c_in * (l_in / l_out);
}

vec3 reinhard_extended(vec3 c, float max_white_l) {
  float l_old = luminance(c);
  float numerator = l_old * (1.0 + (l_old / max_white_l * max_white_l));
  float l_new = numerator / (1.0 + l_old);
  return change_luminance(c, l_new);
}