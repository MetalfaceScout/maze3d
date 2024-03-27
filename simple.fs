precision mediump float;

varying vec2 fragUV;

uniform float fragTexIndex;

uniform float useColor;

uniform vec3 color2d;

uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;

void main()
{
    if (useColor == 1.0) {
        gl_FragColor = vec4(color2d, 1.0);
    } else {
        if (fragTexIndex == 0.0) {
            gl_FragColor = texture2D(uTexture0, fragUV);
        } else if (fragTexIndex == 1.0) {
            gl_FragColor = texture2D(uTexture1, fragUV);
        } else if (fragTexIndex == 2.0) {
            gl_FragColor = texture2D(uTexture2, fragUV);
        } else if (fragTexIndex == 3.0) {
            gl_FragColor = texture2D(uTexture3, fragUV);
        } else if (fragTexIndex == 4.0) {
            gl_FragColor = texture2D(uTexture4, fragUV);
        }
        
        else {
            gl_FragColor = vec4(1, 0, 0, 1);
        }
    }
    
}
