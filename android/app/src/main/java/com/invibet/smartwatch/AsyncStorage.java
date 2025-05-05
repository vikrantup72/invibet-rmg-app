package com.invibetLatest.smartwatch;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativecommunity.asyncstorage.ReactDatabaseSupplier;
import org.json.JSONObject;


public class AsyncStorage {
	public static String TAG = "RNAsyncStorage";
  public ReactApplicationContext context;
  public JSONObject collection;

	Cursor catalystLocalStorage = null;
	SQLiteDatabase readableDatabase = null;

	public AsyncStorage (ReactApplicationContext context) {
		this.context = context;
		this.collection = new JSONObject();
		this.syncLocal();
		// Log.d(TAG, "collection: " + collection.toString());
	}

	public void syncLocal() {
		try {
			readableDatabase = ReactDatabaseSupplier.getInstance(context).getReadableDatabase();
			catalystLocalStorage = readableDatabase.query("catalystLocalStorage", new String[]{"key", "value"}, null, null, null, null, null);

			if (catalystLocalStorage.moveToFirst()) {
				do {
					try {
						int keyIndex = catalystLocalStorage.getColumnIndex("key");
						if (keyIndex == -1) {
							Log.e(TAG, "Invalid key index");
							continue;
						}

						int valueIndex = catalystLocalStorage.getColumnIndex("value");
						if (valueIndex == -1) {
							Log.e(TAG, "Invalid value index");
							continue;
						}

						String jsonKey = catalystLocalStorage.getString(keyIndex);
						String jsonVal = catalystLocalStorage.getString(valueIndex);
						collection.put(jsonKey, jsonVal);
					} catch(Exception e) {
						Log.e(TAG, "Error: " + e);
					}
				} while(catalystLocalStorage.moveToNext());
			}
		} finally {
			if (catalystLocalStorage != null) catalystLocalStorage.close();
			if (readableDatabase != null) readableDatabase.close();
		}
	}

	public void setItem(String keyString, String valueString) {
		try {
			readableDatabase = ReactDatabaseSupplier.getInstance(context).getReadableDatabase();
			readableDatabase.execSQL("INSERT OR REPLACE INTO catalystLocalStorage (keyString, value) VALUES (?, ?)", new Object[]{keyString, valueString});
			collection.put(keyString, valueString);
		} catch(Exception e) {
			Log.e(TAG, "Error: " + e);
		} finally {
			if (readableDatabase != null) readableDatabase.close();
		}
	}

	public void removeItem(String keyString) {
		try {
			readableDatabase = ReactDatabaseSupplier.getInstance(context).getReadableDatabase();
			readableDatabase.execSQL("DELETE FROM catalystLocalStorage WHERE keyString = ?", new Object[]{keyString});
			collection.remove(keyString);
		} catch(Exception e) {
			Log.e(TAG, "Error: " + e);
		} finally {
			if (readableDatabase != null) readableDatabase.close();
		}
	}

	public String getItem(String keyString) {
		try {
			return collection.getString(keyString);
		} catch(Exception e) {
			Log.e(TAG, "Error: " + e);
			return null;
		}
	}
}
