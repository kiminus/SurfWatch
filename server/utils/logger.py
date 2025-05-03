# Configure logging
import logging
import sys

# Default formatter
DEFAULT_LOG_FORMAT = '(%(name)s)[%(asctime)s]%(levelname)s\t%(message)s'
DEFAULT_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
DEFAULT_LOG_LEVEL = logging.INFO

def create_logger(name,
                level=DEFAULT_LOG_LEVEL,
                log_format=DEFAULT_LOG_FORMAT,
                date_format=DEFAULT_DATE_FORMAT,
                stream=sys.stderr):
    """
    Creates and configures a logger instance.

    Args:
        name (str): The name for the logger (e.g., module name like __name__).
        level (int, optional): The minimum logging level. Defaults to logging.INFO.
        log_format (str, optional): The format string for log messages.
                                    Defaults to "[%(asctime)s] [%(name)s] [%(levelname)s]: %(message)s".
        date_format (str, optional): The format string for the date/time.
                                    Defaults to "%Y-%m-%d %H:%M:%S".
        stream (object, optional): The output stream for the handler.
                                    Defaults to sys.stderr.

    Returns:
        logging.Logger: The configured logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    formatter = logging.Formatter(log_format, datefmt=date_format)
    handler = logging.StreamHandler(stream)
    handler.setLevel(level)
    handler.setFormatter(formatter)
    if not any(isinstance(h, logging.StreamHandler) and h.stream == stream for h in logger.handlers):
            logger.addHandler(handler)
    return logger

default_logger = create_logger("SurfWatch", level=DEFAULT_LOG_LEVEL)

def info(message):
    """
    Logs an info message using the default logger.
    """
    default_logger.info(message)

def debug(message):
    """
    Logs a debug message using the default logger.
    """
    default_logger.debug(message)

def warning(message):
    """
    Logs a warning message using the default logger.
    """
    default_logger.warning(message)

def error(message):
    """
    Logs an error message using the default logger.
    """
    default_logger.error(message)