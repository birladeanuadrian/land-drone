

def recognition_to_rectangle(top, right, bottom, left):
    x = left
    y = top
    width = right - x
    height = bottom - y
    return x, y, width, height


def rectangle_to_recognition(x, y, width, height):
    left = x
    top = y
    right = x + width
    bottom = y + height
    return top, right, bottom, left
