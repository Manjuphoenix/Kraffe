package com.example.krafse_ver_0;

import android.view.MotionEvent;
import android.view.View;
import android.widget.RelativeLayout;

//a touch point is created for each individual point of contact the user has with a screen
//Touch events are generated to track the actions of touch points
//In order to make your OpenGL ES application respond to touch events,
// you must implement the onTouchEvent() method in your GLSurfaceView class.

public class TouchListener implements View.OnTouchListener {
    private float x;
    private float y;

    @Override
    public boolean onTouch(View view, MotionEvent motionEvent)  //Called when a touch event is dispatched to a view. This allows listeners to get a chance to respond before the target view.
    {
        //first get the absolute coordinates relative to the device screen
        float x_coor = motionEvent.getRawX();
        float y_coor = motionEvent.getRawY();
        //public static class RelativeLayout.LayoutParams extends ViewGroup.MarginLayoutParams
        //Specifies how a view is positioned within a RelativeLayout
        // lParams is the object of the class.
        RelativeLayout.LayoutParams lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();
        //MotionEvent is the Object used to report movement (mouse, pen, finger, trackball) events
        // 	ACTION_MASK - Bit mask of the parts of the action code that are the action itself.
        switch (motionEvent.getAction() & MotionEvent.ACTION_MASK) {
            //A gesture starts with a motion event with ACTION_DOWN that provides the location of the first pointer down.
            case MotionEvent.ACTION_DOWN:
                //lParams.leftMargin & topMargin, return the no. of pixels of child.
                x = x_coor - lParams.leftMargin;
                y = y_coor - lParams.topMargin;
                //x and y are holding the coordinates of where the user has touched the screen.
                break;
            //ACTION_MOVE - A change has happened during a press gesture (between ACTION_DOWN and ACTION_UP)
            case MotionEvent.ACTION_MOVE:
                lParams.leftMargin = (int) (x_coor - x);
                lParams.topMargin = (int) (y_coor - y);
                //lParams values are set to the coordinates where user has moved the puzzle piece
                view.setLayoutParams(lParams);
                //Sets the view : Puzzle piece on screen has moved.
                break;
        }
        return true;
    }
}
