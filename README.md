This dashboard is built with NextJS with Python Flask as the backend.

## Notebook and model
Go to the notebook and run the first cell (to import the libraries). You may need to ```pip install``` some of the libraries.

Afterwards, run everything starting from **Data Preprocessing** to clean the data, get the exploratory data analysis and train the model needed for the app to run.

The model is dumped and loaded through **Joblib**.

*Note: everything before **Data Preprocessing** is the code to scrape the data from [carlist.my](https://www.carlist.my/).*

## Running the dashboard
To run the backend:
```
cd app
python app.py
```

To run the client:
```
cd client
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
