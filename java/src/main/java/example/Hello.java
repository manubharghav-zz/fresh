package example;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazon.speech.slu.Intent;
import com.amazon.speech.speechlet.IntentRequest;
import com.amazon.speech.speechlet.LaunchRequest;
import com.amazon.speech.speechlet.Session;
import com.amazon.speech.speechlet.SessionEndedRequest;
import com.amazon.speech.speechlet.SessionStartedRequest;
import com.amazon.speech.speechlet.Speechlet;
import com.amazon.speech.speechlet.SpeechletException;
import com.amazon.speech.speechlet.SpeechletResponse;
import com.amazon.speech.ui.PlainTextOutputSpeech;
import com.amazon.speech.ui.SimpleCard;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;



/**
 * This sample shows how to create a simple speechlet for handling speechlet requests.
 */
public class Hello extends SpeechletLambda {
    private static final Logger log = LoggerFactory.getLogger(Hello.class);

    private static final long serialVersionUID = 6998188851979224629L;

    static
    {
        System.setProperty("com.amazon.speech.speechlet.servlet.disableRequestSignatureCheck", "true");
    }
    
    public Hello()
    {
        this.setSpeechlet(new HelloWorldSpeechlet());        
    }
    
//	@Override
//	public String handleRequest(String input, Context context) {
//	  String output = "Hello, " + input + "!";
//	  return output;
//	}

    @Override
    public void handleRequest(InputStream inputStream,
            OutputStream outputStream, Context context) throws IOException
    {
//    	BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
//    	String line = reader.readLine();
//    	line = line + " .Code Works.";
//    	outputStream.write(line.getBytes());
        super.handleRequest(inputStream, outputStream, context);
    }
}
