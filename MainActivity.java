package com.example.krafse_ver_0;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import java.lang.Math;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.google.android.material.bottomappbar.BottomAppBar;

import java.util.ArrayList;
public class MainActivity extends AppCompatActivity {

    ArrayList<Bitmap> pieces;  //Use 'ArrayList' -> Create a BITMAP

    @Override // we need to override a method in sub class
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // creating an object of the Constraint Layout 'layout'
        //final ConstraintLayout layout = findViewById(R.id.layout);
        //has been commented out because of change in Layout type.

        //final layout is set to the new relative layout created after implementing TouchListener
        final RelativeLayout layout = findViewById(R.id.layout);

        ImageView imgStreet = findViewById(R.id.imgStreet); //creating an object of the Image view 'imgStreet'

        imgStreet.post(new Runnable() {
            @Override // we need to override a method in sub class
            public void run() {
                pieces = splitImage();
                TouchListener touchListener = new TouchListener();
                for (Bitmap piece : pieces) { //ImageView is created for each piece returned, and these are added
                    ImageView new_img = new ImageView(getApplicationContext());
                    new_img.setImageBitmap(piece);
                    new_img.setOnTouchListener(touchListener);
                    layout.addView(new_img);
                }
            }
        });
    }

    //This function returns 4 values. Width, Height of the actual image(as appears in layout)
    // + The position of the bitmap with respect to the top and left
    private int[] getBitmapPositionInsideImageView(ImageView imgStreet) {
        int[] pos = new int[4];

        if (imgStreet == null || imgStreet.getDrawable() == null)
            return pos;

        // Get image dimensions
        // Get image matrix values and place them in an array
        float[] f = new float[9]; //9 values always returned
        imgStreet.getImageMatrix().getValues(f);
        //Get the size of the image in image view
        //0 : Scale X
        //1 : Skew X
        //2 : Translate X
        //3 : Scale Y
        //4 : Skew Y
        //5 : Translate Y
        //6 : Perspective 0
        //7 : Perspective 1
        //8 : Perspective 2

        // Extract the scale values using the constants
        //Scale is equal to the ratio of the photo distance to the parent element's edges
        final float scaleX = f[Matrix.MSCALE_X];
        final float scaleY = f[Matrix.MSCALE_Y];

        // create drawable object and access the image
        final Drawable d = imgStreet.getDrawable();
        //Intrinsic width is the REAL width
        final int realW = d.getIntrinsicWidth();
        final int realH = d.getIntrinsicHeight();
        //Scaling by a constant is performed using:
        //Q(i,j) = P(i,j) * C
        final int ScaledW = Math.round(realW * scaleX);
        final int ScaledH = Math.round(realH * scaleY);
        // actH and actW hold the actual dimensions of scaled image on screen

        pos[2] = ScaledW;
        pos[3] = ScaledH;
        //Storing the width and height of puzzle pieces

        // Get image position
        // We assume that the image is centered into ImageView
        pos[0] = (int) (imgStreet.getWidth() - ScaledW) / 2;
        pos[1] = (int) (imgStreet.getHeight() - ScaledH) / 2;

        //ScaledLeft(pos[0]) = (Image_View_width - (RealWidth * ScaleX)) / 2 => Bitmap position from top (in px)
        //ScaledTop(pos[1]) = (Image_View_height - (RealWidth * ScaleY)) / 2 => Bitmap position from left (in px)

        return pos;
    }

    private ArrayList<Bitmap> splitImage() {
        int r = 3, c = 3, pNum = 9;

        ImageView imgStreet = findViewById(R.id.imgStreet); //create imageView object to access it.
        ArrayList<Bitmap> pieces = new ArrayList<>(pNum); //create bitmap

        //get a scaled bitmap of the source image
        BitmapDrawable img = (BitmapDrawable) imgStreet.getDrawable();
        Bitmap bitmap = img.getBitmap();

        //The source image positions and dimensions are are returned in the below function call
        int[] positions = getBitmapPositionInsideImageView(imgStreet);
        int scaledBitmapLeft = positions[0];
        int scaledBitmapTop = positions[1];
        int scaledBitmapWidth = positions[2];
        int scaledBitmapHeight = positions[3];

        //cropping and scaling the image. W


        //Cropping the image height and width
        //Image's cropped height and width calculated by BitmapScaled value from all 4 sides
        int croppedImageWidth = scaledBitmapWidth - 2 * Math.abs(scaledBitmapLeft);
        int croppedImageHeight = scaledBitmapHeight - 2 * Math.abs(scaledBitmapTop);

        //use the createScaledBitmap inbuilt function to create a scaled bitmap.
        // Scaled values of height and width were passed in positions array.
        Bitmap scaledBitmap = Bitmap.createScaledBitmap(bitmap, scaledBitmapWidth, scaledBitmapHeight, true);
        //Now we finally create a cropped bitmap.
        //Cropped bitmap will be created using the scaled bitmap and calculated cropped dimensions.
        Bitmap croppedBitmap = Bitmap.createBitmap(scaledBitmap, Math.abs(scaledBitmapLeft), Math.abs(scaledBitmapTop), croppedImageWidth, croppedImageHeight);

        //get width and height of individual pieces pieces
        int pWidth = croppedImageWidth / c;
        int pHeight = croppedImageHeight / r;

        // CREATE PUZZLE PIECES
        // Add to the pieces array, which is returned to main function.
        int y_coordinate = 0;
        for (int row = 0; row < r; row++) {
            int x_coordinate = 0;
            for (int col = 0; col < c; col++) {
                pieces.add(Bitmap.createBitmap(croppedBitmap, x_coordinate, y_coordinate, pWidth, pHeight));
                x_coordinate += pWidth;
            }
            y_coordinate += pHeight;
        }
        return pieces;
    }

}