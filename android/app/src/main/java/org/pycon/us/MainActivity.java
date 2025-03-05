package org.pycon.us;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		getWindow().getDecorView().setSystemUiVisibility(
			android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
		);
	}
}
