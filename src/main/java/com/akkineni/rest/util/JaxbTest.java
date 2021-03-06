package com.akkineni.rest.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.stream.events.XMLEvent;
import com.akkineni.schema.so.ServiceOrderDTO;

public class JaxbTest {

	public static void main(String args[]) {
		try {
			JAXBContext jaxbCtx = JAXBContext
					.newInstance("com.akkineni.schema.custom");
			Unmarshaller unmarshaller = jaxbCtx.createUnmarshaller();
			XMLInputFactory factory = XMLInputFactory.newInstance();
			XMLStreamReader reader = factory
					.createXMLStreamReader(new FileInputStream(new File(
							"src/main/webapp/xml/input.xml")));
			while (reader.hasNext()) {
				int event = reader.next();
				System.out.println(event);
				if (event == XMLEvent.START_DOCUMENT) {
					String str = reader.getText();
					System.out.println(str);
				}
				if (event == XMLEvent.START_ELEMENT) {
					System.out.println(reader.getLocalName());
					if (reader.getLocalName() == "InvoiceType") {
						ServiceOrderDTO orderDto = (ServiceOrderDTO) unmarshaller
								.unmarshal(reader);
						System.out.println(orderDto);
					}
				}
			}
		} catch (JAXBException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (XMLStreamException e) {
			e.printStackTrace();
		}
	}
}