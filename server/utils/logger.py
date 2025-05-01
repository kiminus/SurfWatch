# Configure logging
import logging

# Default formatter
defaultformat = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def create_logger(logger_name, formatter=defaultformat):
    logger = logging.getLogger(logger_name)
    if not logger.handlers:  # Avoid adding multiple handlers
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger